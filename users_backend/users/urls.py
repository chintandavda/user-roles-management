from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register-rm/', RegisterRMView.as_view(), name='register_rm'),
    path('view-rms/', ViewAllRMView.as_view(), name='view_rms'),
    path('view-rm-clients/<int:rm_id>/', ViewRMClientsView.as_view(), name='view_rm_clients'),
    path('delete-rm/<int:rm_id>/', DeleteRMView.as_view(), name='delete_rm'),
    path('register-client/', RegisterClientView.as_view(), name='register_client'),
    path('client-detail/<int:client_id>/', ClientDetailView.as_view(), name='client_detail'),
    path('request-change/', CreateChangeRequestView.as_view(), name='request_change'),
    path('rm/view-requests/', ViewRMChangeRequests.as_view(), name='view_rm_requests'),
    path('rm/update-request/<int:request_id>/', UpdateChangeRequestStatus.as_view(), name='update_request_status'),
    path('admin/view-requests/', ViewAllChangeRequests.as_view(), name='view_all_requests'),
    path('client-dashboard/<int:client_id>/', ClientDashboardView.as_view(), name='client_dashboard'),
    path('rm-dashboard/<int:rm_id>/', RMDashboardView.as_view(), name='rm_dashboard'),
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/rms-clients/', ListRMsAndClientsView.as_view(), name='list_rms_clients'),
]
