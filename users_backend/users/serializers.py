from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser, ChangeRequest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class RegisterRMSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='rm'
        )
        return user


class RegisterClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    rm_id = serializers.IntegerField(write_only=True)  # RM ID will be sent in the request

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'rm_id']

    def create(self, validated_data):
        rm_id = validated_data.pop('rm_id', None)
        rm = CustomUser.objects.filter(id=rm_id, role="rm").first()  # Get RM object
        if not rm:
            raise serializers.ValidationError("Invalid RM ID")

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='client',
            rm=rm  # Assign to RM
        )
        return user


class ClientDetailSerializer(serializers.ModelSerializer):
    rm = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'rm']

    def get_rm(self, obj):
        return {"id": obj.rm.id, "username": obj.rm.username} if obj.rm else None


class ChangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangeRequest
        fields = ['id', 'requested_changes', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']


class ClientDashboardSerializer(serializers.ModelSerializer):
    total_requests = serializers.SerializerMethodField()
    pending_requests = serializers.SerializerMethodField()
    rm = serializers.SerializerMethodField() 

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'rm', 'total_requests', 'pending_requests']

    def get_total_requests(self, obj):
        return obj.change_requests.count()

    def get_pending_requests(self, obj):
        return obj.change_requests.filter(status="pending").count()
    
    def get_rm(self, obj):
        return {"id": obj.rm.id, "username": obj.rm.username} if obj.rm else None


class RMDashboardSerializer(serializers.ModelSerializer):
    total_clients = serializers.SerializerMethodField()
    pending_requests = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'total_clients', 'pending_requests']

    def get_total_clients(self, obj):
        return obj.clients.count()

    def get_pending_requests(self, obj):
        return ChangeRequest.objects.filter(client__rm=obj, status="pending").count()


class AdminDashboardSerializer(serializers.Serializer):
    total_rms = serializers.IntegerField()
    total_clients = serializers.IntegerField()
    total_pending_requests = serializers.IntegerField()
