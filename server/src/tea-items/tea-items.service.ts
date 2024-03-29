import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { CreateTeaDto } from './dto/create-teaItem.dto';
import { Tea } from './tea-items.model';

@Injectable()
export class TeaItemsService {
    
    constructor(@InjectModel(Tea) private teaRepository: typeof Tea,
                private filesService: FilesService) {}

    async create(dto: CreateTeaDto, image: any) {
        const fileName = await this.filesService.createFile(image);
        const teaItem = await this.teaRepository.create({...dto, image: fileName});
        return teaItem;
    }

    async update(id: number, dto: CreateTeaDto, image: any) {
        const teaItem = await this.teaRepository.findOne({where: {id}})
        if (!teaItem) {
            throw new HttpException('Такого чая не существует в базе данных', HttpStatus.BAD_REQUEST)
        }
        if (image) {
            await this.filesService.deleteFile(teaItem.image)
            const fileName = await this.filesService.createFile(image);
            teaItem.set({...dto, image: fileName})
        } else {
            teaItem.set({...teaItem, ...dto})
        }

        await teaItem.save()
        return teaItem
    }

    async delete(id: number) {
        const teaItem = await this.teaRepository.findOne({where: {id}})
        if (!teaItem) {
            throw new HttpException('Такого чая не существует в базе данных', HttpStatus.BAD_REQUEST)
        }
        await this.filesService.deleteFile(teaItem.image)
        await teaItem.destroy()
        return {message: `Item with id ${id} has been destroyed`}
    }

    async getAll() {
        const teaItems = await this.teaRepository.findAll()
        return teaItems;
    }

    async getAllWithPages(limit: number = 8, page: number = 1, categoryId: number = 0, order: string = 'asc', sortBy: string = 'id', search?: string) {
        const offset = page * limit - limit

        let teaItems: any = []
        if (categoryId === 0) {
            teaItems = await this.teaRepository.findAndCountAll({limit, offset, order: [[sortBy, order]]})
        } else {
            teaItems = await this.teaRepository.findAndCountAll({where: {categoryId}, limit, offset, order: [[sortBy, order]]})
        }

        if (search) {
            const newRows = teaItems.rows.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
            teaItems = {count: newRows.length, rows: newRows}
        }

        return teaItems
    }

    async getByPk(id: number) {
        const teaItem = await this.teaRepository.findByPk(id)
        return teaItem
    }

}
