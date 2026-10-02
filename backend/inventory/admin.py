from django.contrib import admin
from .models import StockMovement,StockTransfer,Inventory
# Register your models here.
admin.site.register(StockMovement)
admin.site.register(StockTransfer)
admin.site.register(Inventory)

