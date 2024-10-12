from django.contrib import admin

from .models import Category, Product, Image, ProductDetail, Rating


class ProductDetailInline(admin.TabularInline):
    model = ProductDetail
    extra = 1


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', '_parent', 'is_delete']
    search_fields = ['name']
    list_editable = ['is_delete']


class ImageInline(admin.TabularInline):
    model = Image
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'average_rating', 'is_delete']
    search_fields = ['name']
    list_filter = ['category']
    ordering = ['name']
    list_editable = ('is_delete',)
    inlines = [ImageInline, ProductDetailInline]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "category":
            kwargs["queryset"] = Category.objects.filter(_parent__isnull=False, childes__isnull=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'src']
    list_filter = ['product']


admin.site.register(Product, ProductAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Category, CategoryAdmin)
