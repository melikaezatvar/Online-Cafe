from django.db import models
from django.conf import settings
from menu.models import Product
from core.models import TimeStampMixin, LogicalMixin


class Comment(TimeStampMixin, LogicalMixin):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField(max_length=500)
    reply_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    is_active = models.BooleanField(default=False)
    rejected_message = models.TextField(null=True, blank=True)

    @property
    def count_like(self):
        like = self.reaction.filter(react='L').count()
        return f'{like}'

    @property
    def count_dislike(self):
        dislike = self.reaction.filter(react='D').count()
        return f'{dislike}'

    def __str__(self):
        return f'{self.comment[:20]}'


class Reaction(models.Model):
    REACTION_OPTIONS = (
        ('L', 'Like'),
        ('D', 'Dislike'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reaction')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reaction')
    react = models.CharField(max_length=1, choices=REACTION_OPTIONS)

    def __str__(self):
        return f'{self.comment}'

    class Meta:
        unique_together = ('user', 'comment')
