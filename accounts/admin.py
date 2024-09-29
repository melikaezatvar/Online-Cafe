# from django.contrib import admin
# from django.apps import apps
#
# models = apps.get_models()
#
# for model in models:
#     try:
#         admin.site.register(model)
#     except admin.sites.AlreadyRegistered:
#         pass


# from django.contrib import admin
# from .models import CustomerProfile
#
#
# class CustomerProfileAdmin(admin.ModelAdmin):
#     is_admin = CustomerProfile.objects.all()
#     list_display = ('name', 'email', 'phone')
#     search_fields = ('name',)
#     list_filter = ('name', 'email', 'phone')
#
#
# admin.site.register(CustomerProfile, CustomerProfileAdmin)