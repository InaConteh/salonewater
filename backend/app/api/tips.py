from app.api import bp

TIPS = [
    {
        'id': 1,
        'title': 'Drink safe water',
        'message': 'Always use boiled or filtered water for drinking and cooking.',
    },
    {
        'id': 2,
        'title': 'Wash hands often',
        'message': 'Wash your hands with soap before eating and after using the toilet.',
    },
    {
        'id': 3,
        'title': 'Keep water sources clean',
        'message': 'Report damaged or contaminated sources immediately.',
    },
]


@bp.route('/tips', methods=['GET'])
def get_tips():
    return {'tips': TIPS}


@bp.route('/tips/<int:tip_id>', methods=['GET'])
def get_tip(tip_id):
    tip = next((item for item in TIPS if item['id'] == tip_id), None)
    if not tip:
        return {'error': 'Tip not found'}, 404
    return tip
