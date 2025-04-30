import { InvalidDeliveryPhotoTypeError } from '@/domain/app/application/use-cases/errors/invalid-delivery-photo-type'
import { UploadPhotoDeliveryUseCase } from '@/domain/app/application/use-cases/upload-photo-delivery'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/order/delivery-photo/:orderId')
export class UploadPhotoDeliveryController {
  constructor(
    private readonly uploadPhotoDelivery: UploadPhotoDeliveryUseCase,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Param('orderId') orderId: string,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2,
        }), // 2mb
        new FileTypeValidator({
          fileType: '(.png|.jpg|.jpeg|.pdf)',
        }),
      ],
    })) file: Express.Multer.File,
  ) {
    const response = await this.uploadPhotoDelivery.execute({
      orderId,
      fileType: file.mimetype,
      fileName: file.originalname,
      body: file.buffer,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidDeliveryPhotoTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { deliveryPhoto } = response.value

    return {
      url: deliveryPhoto.url,
    }
  }
}
