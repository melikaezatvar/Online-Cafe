from django.contrib import admin
from menu.models import Product
from .models import Order, OrderItem


class CategoryFilter(admin.SimpleListFilter):
    title = 'Product Category'
    parameter_name = 'category'

    def lookups(self, request, model_admin):
        categories = set(Product.objects.values_list('category', flat=True))
        return [(category, category) for category in categories]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(items__product__category=self.value())
        return queryset


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    list_display = ('product', 'quantity')
    extra = 1


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'create_at', 'update_at')
    list_filter = ('update_at', 'create_at')
    search_fields = ('user__username', 'items__product__category__name')
    inlines = [OrderItemInline]
    list_editable = ("status",)
    readonly_fields = ('create_at', 'update_at')
    ordering = ('create_at',)
    list_select_related = ('user',)
    date_hierarchy = 'update_at'

    actions = ['mark_as_shipped']

    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
        self.message_user(request, f"{queryset.count()} order(s) marked as shipped.")
    mark_as_shipped.short_description = "Mark selected orders as shipped"


admin.site.register(Order, OrderAdmin)