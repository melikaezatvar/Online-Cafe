from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user',
                    'product',
                    'comment',
                    'reply_comment',
                    'is_active',
                    'is_delete',
                    'count_like',
                    'count_dislike',
                    'create_at')
    search_fields = ['user', 'comment', 'product']
    list_filter = ['is_active', 'product']
    list_editable = ('is_delete', 'is_active')
    actions = ['make_active', 'make_inactive']

    @admin.action(description='Activate selected comments')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected comments')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)

