from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ChangeRequest

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'username', 'email', 'role', 'rm', 'is_staff', 'is_active')  # Show role in the list
    list_filter = ('role', 'is_staff', 'is_active', 'rm')  # Add role filter in the admin panel
    search_fields = ('username', 'email', 'rm__username')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'rm')}),  # Add role in the user edit page
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'rm')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(ChangeRequest)
class ChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'requested_changes', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('client__username',)
    ordering = ('-created_at',)