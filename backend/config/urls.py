from django.contrib import admin
from django.urls import include, path

from .views import health_check
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/health/", health_check),

    path("api/auth/", include("accounts.urls")),
    path("api/companies/",include("companies.urls")),

    path(
    "api/warehouses/",
    include("warehouses.urls")),


    path(
    "api/products/",
    include("products.urls"),


    
),
path(
    "api/inventory/",
    include("inventory.urls"),
),

]
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)