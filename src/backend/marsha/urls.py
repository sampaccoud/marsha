"""Marsha URLs configuration."""

from django.conf import settings
from django.urls import include, path

from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view

from marsha.core.admin import admin_site
from marsha.core.api import TimedTextTrackViewSet, VideoViewSet, update_state
from marsha.core.views import LTIDevelopmentView, VideoLTIView


router = DefaultRouter()
router.register(r"videos", VideoViewSet, base_name="videos")
router.register(
    r"timedtexttracks", TimedTextTrackViewSet, base_name="timed_text_tracks"
)

urlpatterns = [
    path(f"{admin_site.name}/", admin_site.urls),
    path("lti-video/", VideoLTIView.as_view(), name="lti_video"),
    path("api/update-state", update_state, name="update_state"),
    path("api/schema", get_schema_view(title="Marsha API"), name="schema"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += [
        path("development/", LTIDevelopmentView.as_view(), name="lti-development-view")
    ]
