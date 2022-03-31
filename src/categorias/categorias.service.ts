import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categoria.interface';

import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(criarCategoriaDto: CriarCategoriaDto) {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(
        `A categoria ${categoria} já está cadastrada`,
      );
    }

    const novaCategoria = new this.categoriaModel(criarCategoriaDto);
    return await novaCategoria.save();
  }

  async consultarTodasCategorias() {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(categoria: string) {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `A categoria ${categoria} não foi encontrada`,
      );
    }

    return categoriaEncontrada;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ) {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `A categoria ${categoria} não foi encontrada`,
      );
    }

    await this.categoriaModel
      .updateOne({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]) {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `A categoria ${categoria} não foi encontrada`,
      );
    }

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .findOne({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (jogadorJaCadastradoCategoria) {
      throw new BadRequestException(
        `Jogador com id ${idJogador} já cadastrado na categoria ${categoria}`,
      );
    }

    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaEncontrada },
    );
  }

  async consultarCategoriaDoJogador(_id: any) {
    await this.jogadoresService.verificarSeJogadorFoiEncontrado(_id);

    const categoriaJogador = await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(_id)
      .exec();

    if (!categoriaJogador) {
      throw new BadRequestException(
        `Jogador com id ${_id} não cadastrado em nenhuma categoria`,
      );
    }

    return categoriaJogador;
  }
}
