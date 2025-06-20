from .google_drive import google_drive_service  # noqa
import importlib as _importlib
google_drive = _importlib.import_module(__name__ + '.google_drive') 