import base64
import hashlib

import sqlalchemy as sa

from .. import db

names = [
    'Andromeda',
    'Antlia',
    'Apus',
    'Aquarius',
    'Aquila',
    'Ara',
    'Aries',
    'Auriga',
    'Bootes',
    'Caelum',
    'Camelopardalis',
    'Cancer',
    'Canes Venatici',
    'Canis Major',
    'Canis Minor',
    'Capricornus',
    'Carina',
    'Cassiopeia',
    'Centaurus',
    'Cepheus',
    'Cetus',
    'Chamaeleon',
    'Circinus',
    'Columba',
    'Coma Berenices',
    'Corona Australis',
    'Corona Borealis',
    'Corvus',
    'Crater',
    'Crux',
    'Cygnus',
    'Delphinus',
    'Dorado',
    'Draco',
    'Equuleus',
    'Eridanus',
    'Fornax',
    'Gemini',
    'Grus',
    'Hercules',
    'Horologium',
    'Hydra',
    'Hydrus',
    'Indus',
    'Lacerta',
    'Leo',
    'Leo Minor',
    'Lepus',
    'Libra',
    'Lupus',
    'Lynx',
    'Lyra',
    'Mensa',
    'Microscopium',
    'Monoceros',
    'Musca',
    'Norma',
    'Octans',
    'Ophiuchus',
    'Orion',
    'Pavo',
    'Pegasus',
    'Perseus',
    'Phoenix',
    'Pictor',
    'Pisces',
    'Piscis Austrinus',
    'Puppis',
    'Pyxis',
    'Reticulum',
    'Sagitta',
    'Sagittarius',
    'Scorpius',
    'Sculptor',
    'Scutum',
    'Serpens',
    'Sextans',
    'Taurus',
    'Telescopium',
    'Triangulum',
    'Triangulum Austale',
    'Tucana',
    'Ursa Major',
    'Ursa Minor',
    'Vela',
    'Virgo',
    'Volans',
    'Vulpecula',
]


class Node(db.Base):
    __tablename__ = "node"

    id = sa.Column(sa.Integer, primary_key=True)
    url = sa.Column(sa.String, index=True, nullable=False)
    address = sa.Column(sa.String, index=True, nullable=True)
    name = sa.Column(sa.String, nullable=True)

    def generate_address(self) -> str:
        bs = hashlib.shake_128(self.id.to_bytes(4, "big")).digest(30)
        self.address = base64.b32encode(bs).decode("utf-8")
        return self.address

    def generate_name(self) -> str:
        index = self.id % len(names)
        self.name = names[index]
        return self.name