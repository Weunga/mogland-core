/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { fileTypeFromBuffer, fileTypeFromFile, fileTypeStream } from 'file-type';
import { join } from 'path';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { THEME_DIR } from '~/constants/path.constant';
import { ThemeService } from './theme.service';
import mime from 'mime';

@Controller('theme')
@ApiName
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) { }

  // ********************************************************
  // 以下是管理命令

  @Get('/admin/available')
  @Auth()
  async availableThemes() {
    return this.themeService.availableThemes();
  }

  @Get('/admin/up')
  @Auth()
  async turnOnTheme(@Query('name') name: string) {
    return this.themeService.turnOnTheme(name);
  }

  @Get('/admin/current')
  @Auth()
  async currentTheme() {
    return this.themeService.currentTheme();
  }

  @Get('/admin/off')
  @Auth()
  async turnOffTheme(@Query('name') name: string) {
    return this.themeService.turnOffTheme(name);
  }

  // ********************************************************
  // 以下是针对静态资源访问的接口
  @Get('/public/*')
  async public(@Res() res, @Param() param: string) {
    const filePath = join(THEME_DIR, (await this.themeService.currentTheme())!.name, "public", param['*']);
    const file = await fs.readFile(filePath);
    if (!file) {
      return res.status(404).send();
    } else {
      res.type(mime.getType(filePath));
      res.send(file);
    }
  }


  // ********************************************************
  // 以下是主题渲染相关的方法

  @Get('/')
  async renderIndex(@Res() res) {
    return await res.view(`${(await this.themeService.currentTheme())!.name}/index.ejs`, {
      title: '首页',
    });
  }
}
