from django.db import models


class TimeStampMixin(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AbstractDeleteModel(models.Model):
    is_delete = models.BooleanField(default=False)

    class Meta:
        abstract = True
