from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class CompatibilityTestBase(BaseModel):
    test_type: str
    test_date: datetime
    result: str
    notes: Optional[str] = None

class CompatibilityTestCreate(CompatibilityTestBase):
    pass

class CompatibilityTestUpdate(CompatibilityTestBase):
    test_type: Optional[str] = None
    test_date: Optional[datetime] = None
    result: Optional[str] = None

class CompatibilityTestInDBBase(CompatibilityTestBase):
    id: UUID
    product_id: UUID
    class Config:
        orm_mode = True

class CompatibilityTest(CompatibilityTestInDBBase):
    pass

class CompatibilityTestInDB(CompatibilityTestInDBBase):
    created_at: datetime = None
    updated_at: datetime = None 