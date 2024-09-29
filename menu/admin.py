from django.contrib import admin
from .models import Category, Product, Image


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', '_parent']
    search_fields = ['name']


class ImageInline(admin.TabularInline):
    model = Image
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'quantity']
    search_fields = ['name']
    list_filter = ['category']
    ordering = ['name']
    inlines = [ImageInline]


class ImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'src']
    list_filter = ['product']


admin.site.register(Product, ProductAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Category, CategoryAdmin)
