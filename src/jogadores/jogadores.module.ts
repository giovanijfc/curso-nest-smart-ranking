import { Module } from '@nestjs/common';
import { MongooseModule as MongooseModuleInstance } from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogador.schema';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';

const MongooseModule = MongooseModuleInstance.forFeature([
  { name: 'Jogador', schema: JogadorSchema },
]);

@Module({
  imports: [MongooseModule],
  controllers: [JogadoresController],
  providers: [JogadoresService],
})
export class JogadoresModule {}
