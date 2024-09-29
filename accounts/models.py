from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomerProfile(AbstractUser):
    phone_number = models.CharField(max_length=11, unique=True, null=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    is_ban = models.BooleanField(default=False)
    favorite = models.ManyToManyField('menu.Product', blank=True, related_name='favorite_products')

    def __str__(self):
        return self.username
