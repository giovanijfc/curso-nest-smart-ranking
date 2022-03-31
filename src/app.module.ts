import { Module } from '@nestjs/common';
import { MongooseModule as MongooseModuleInstance } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';

const MongooseModule = MongooseModuleInstance.forRoot(
  'mongodb+srv://admin:ASjTQJZyJD6AjsgA@clustersmartranking.xt7nj.mongodb.net/smartranking?retryWrites=true&w=majority',
);

@Module({
  imports: [MongooseModule, JogadoresModule, CategoriasModule, DesafiosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
