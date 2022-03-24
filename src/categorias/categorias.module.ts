import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MongooseModule as MongooseModuleInstance } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categoria.schema';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

const MongooseModule = MongooseModuleInstance.forFeature([
  { name: 'Categoria', schema: CategoriaSchema },
]);

@Module({
  imports: [MongooseModule, JogadoresModule],
  providers: [CategoriasService],
  controllers: [CategoriasController],
})
export class CategoriasModule {}
