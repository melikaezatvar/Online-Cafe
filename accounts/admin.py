from django.contrib import admin
from .models import CustomerProfile
from django.contrib.admin import DateFieldListFilter


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('username','email', 'phone_number', 'is_ban', 'is_staff', 'get_groups', 'date_joined', 'balance')
    list_filter = ('is_ban', 'is_staff', ('date_joined', DateFieldListFilter))
    search_fields = ('username', 'email', 'phone_number')
    list_editable = ('is_ban', 'is_staff')
    actions = ['make_staff', 'ban_customer']

    def make_staff(self, request, queryset):
        queryset.update(is_staff=True)
        self.message_user(request, "Selected customers have been granted staff access.")

    make_staff.short_description = "Grant staff access to selected customers"

    def ban_customer(self, request, queryset):
        queryset.update(is_ban=True)
        self.message_user(request, "Selected customers have been banned.")

    ban_customer.short_description = "Ban selected customers"

    def get_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])

    get_groups.short_description = 'Groups'


