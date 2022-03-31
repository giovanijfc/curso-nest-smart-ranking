import * as mongoose from 'mongoose';
import { Partida } from './partida.interface';

export const PartidaSchema = new mongoose.Schema<Partida>(
  {
    categoria: { type: String },
    jogadores: [{ type: mongoose.Types.ObjectId, ref: 'Jogador' }],
    def: { type: mongoose.Types.ObjectId, ref: 'Jogador' },
    resultado: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'partidas' },
);
