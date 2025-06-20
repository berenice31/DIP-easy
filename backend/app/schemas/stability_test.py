from typing import Optional
from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel

class StabilityTestBase(BaseModel):
    test_type: str
    test_date: datetime
    result: str
    notes: Optional[str] = None

class StabilityTestCreate(StabilityTestBase):
    pass

class StabilityTestUpdate(StabilityTestBase):
    test_type: Optional[str] = None
    test_date: Optional[datetime] = None
    result: Optional[str] = None

class StabilityTestInDBBase(StabilityTestBase):
    id: UUID
    product_id: UUID
    class Config:
        orm_mode = True

class StabilityTest(StabilityTestInDBBase):
    pass

class StabilityTestInDB(StabilityTestInDBBase):
    created_at: datetime = None
    updated_at: datetime = None 