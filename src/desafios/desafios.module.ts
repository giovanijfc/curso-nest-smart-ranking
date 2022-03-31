import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { MongooseModule as MongooseModuleInstance } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { PartidaSchema } from './interfaces/partida.schema';

const MongooseModule = MongooseModuleInstance.forFeature([
  { name: 'Desafio', schema: DesafioSchema },
  { name: 'Partida', schema: PartidaSchema },
]);

@Module({
  imports: [MongooseModule, JogadoresModule, CategoriasModule],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
