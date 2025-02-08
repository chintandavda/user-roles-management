from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status
from .models import CustomUser, ChangeRequest
from .serializers import *
from django.shortcuts import get_object_or_404



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role  # Add role to the token payload
        return token



class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            token_response = super().post(request, *args, **kwargs)
            return Response({"token": token_response.data, "role": user.role}, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



class RegisterRMView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = RegisterRMSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "RM registered successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ViewAllRMView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        rms = CustomUser.objects.filter(role="rm")
        serializer = UserSerializer(rms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ViewRMClientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rm_id):
        if request.user.role != "admin":
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        rm = get_object_or_404(CustomUser, id=rm_id, role="rm")
        clients = CustomUser.objects.filter(role="client", rm=rm)
        serializer = UserSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteRMView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, rm_id):
        if request.user.role != "admin":
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        rm = get_object_or_404(CustomUser, id=rm_id, role="rm")
        rm.delete()
        return Response({"message": "RM deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class RegisterClientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "rm":
            return Response({"error": "Only RMs can register clients"}, status=status.HTTP_403_FORBIDDEN)

        serializer = RegisterClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Client registered successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, client_id):
        user = request.user
        client = get_object_or_404(CustomUser, id=client_id, role="client")

        # Admin can view any client
        if user.role == "admin":
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # RM can only view their own clients
        if user.role == "rm" and client.rm == user:
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Clients can only view their own profile
        if user.role == "client" and client == user:
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)


class CreateChangeRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "client":
            return Response({"error": "Only clients can request data changes"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChangeRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(client=request.user)  # Auto-assign client
            return Response({"message": "Change request submitted"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewRMChangeRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "rm":
            return Response({"error": "Only RMs can view requests"}, status=status.HTTP_403_FORBIDDEN)

        requests = ChangeRequest.objects.filter(client__rm=request.user, status="pending")
        serializer = ChangeRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateChangeRequestStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, request_id):
        if request.user.role != "rm":
            return Response({"error": "Only RMs can approve/reject requests"}, status=status.HTTP_403_FORBIDDEN)

        change_request = get_object_or_404(ChangeRequest, id=request_id, client__rm=request.user)

        new_status = request.data.get("status")  # Renamed variable to avoid conflict
        if new_status not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        change_request.status = new_status
        change_request.save()

        return Response({"message": f"Request {new_status} successfully"}, status=status.HTTP_200_OK)




class ViewAllChangeRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admins can view all requests"}, status=status.HTTP_403_FORBIDDEN)

        requests = ChangeRequest.objects.all()
        serializer = ChangeRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, client_id):
        user = request.user
        client = get_object_or_404(CustomUser, id=client_id, role="client")

        # Admin can view any client's dashboard
        if user.role == "admin":
            serializer = ClientDashboardSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # RM can view only their assigned clients
        if user.role == "rm" and client.rm == user:
            serializer = ClientDashboardSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Clients can view only their own dashboard
        if user.role == "client" and client == user:
            serializer = ClientDashboardSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)


class RMDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rm_id):
        user = request.user
        rm = get_object_or_404(CustomUser, id=rm_id, role="rm")

        # Admin can view any RM's dashboard
        if user.role == "admin":
            serializer = RMDashboardSerializer(rm)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # RM can only view their own dashboard
        if user.role == "rm" and rm == user:
            serializer = RMDashboardSerializer(rm)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admins can view this dashboard"}, status=status.HTTP_403_FORBIDDEN)

        total_rms = CustomUser.objects.filter(role="rm").count()
        total_clients = CustomUser.objects.filter(role="client").count()
        total_pending_requests = ChangeRequest.objects.filter(status="pending").count()

        data = {
            "total_rms": total_rms,
            "total_clients": total_clients,
            "total_pending_requests": total_pending_requests
        }

        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListRMsAndClientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admins can view this data"}, status=403)

        rms = CustomUser.objects.filter(role="rm").prefetch_related("clients")
        data = []

        for rm in rms:
            clients = rm.clients.all()
            rm_data = {
                "id": rm.id,
                "username": rm.username,
                "email": rm.email,
                "total_clients": clients.count(),
                "clients": [{"id": client.id, "username": client.username, "email": client.email} for client in clients],
            }
            data.append(rm_data)

        return Response(data, status=200)