import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    return await this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias() {
    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPeloId(@Param('categoria') categoria: string) {
    return await this.categoriasService.consultarCategoriaPeloId(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('categoria') categoria: string,
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
  ) {
    await this.categoriasService.atualizarCategoria(
      categoria,
      atualizarCategoriaDto,
    );
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirCategoriaJogador(@Param() params: string[]) {
    return await this.categoriasService.atribuirCategoriaJogador(params);
  }
}
