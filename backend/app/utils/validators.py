"""Input validation and PRD cause-category mapping."""

# PRD six categories: code -> canonical key
CAUSE_CATEGORIES = {
    '1': 'drought',
    '2': 'broken_pump',
    '3': 'dry_well',
    '4': 'contamination',
    '5': 'overuse',
    '6': 'seasonal',
    'drought': 'drought',
    'broken_pump': 'broken_pump',
    'broken': 'broken_pump',
    'pump': 'broken_pump',
    'dry_well': 'dry_well',
    'dry': 'dry_well',
    'contamination': 'contamination',
    'overuse': 'overuse',
    'seasonal': 'seasonal',
}

VALID_STATUSES = frozenset({'green', 'yellow', 'red'})

CAUSE_TO_STATUS = {
    'contamination': 'red',
    'broken_pump': 'red',
    'dry_well': 'red',
    'drought': 'yellow',
    'overuse': 'yellow',
    'seasonal': 'yellow',
}


def normalize_cause(raw: str) -> str | None:
    if not raw:
        return None
    key = raw.strip().lower().replace(' ', '_')
    return CAUSE_CATEGORIES.get(key) or CAUSE_CATEGORIES.get(key.replace('_', ''))


def validate_status(status: str) -> bool:
    return (status or '').lower() in VALID_STATUSES


def cause_to_status(cause: str) -> str:
    normalized = normalize_cause(cause) or cause
    return CAUSE_TO_STATUS.get(normalized, 'yellow')
