from django.contrib import admin
from .models import CustomerProfile


class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone_number', 'is_ban', 'is_staff')
    list_filter = ('email', 'phone_number')
    actions = ['make_staff', 'ban_customer']

    def make_staff(self, request, queryset):
        queryset.update(is_staff=True)
        self.message_user(request, "Selected customers have been granted staff access.")

    make_staff.short_description = "Grant staff access to selected customers"

    def ban_customer(self, request, queryset):
        queryset.update(is_ban=True)
        self.message_user(request, "Selected customers have been banned.")

    ban_customer.short_description = "Ban selected customers"

admin.site.register(CustomerProfile, CustomerProfileAdmin)
