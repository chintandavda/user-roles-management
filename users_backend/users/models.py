from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, role="client", **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, role="admin", **extra_fields)


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('rm', 'Relationship Manager'),
        ('client', 'Client'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    rm = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='clients')

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} - {self.role}"


class ChangeRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="change_requests")
    requested_changes = models.JSONField()  # Store requested changes in JSON format
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} - {self.client.username} - {self.status}"
