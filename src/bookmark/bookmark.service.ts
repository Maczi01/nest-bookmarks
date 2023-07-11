import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getAllBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = this.prisma.bookmark.create({
      data: { ...createBookmarkDto, userId },
    });
    return bookmark;
  }

  updateBookmark(
    userId: number,
    bookmarkId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return `This action updates a #${bookmarkId} bookmark`;
  }

  removeBookmark(userId: number, bookmarkId: number) {
    return `This action removes a #${bookmarkId} bookmark`;
  }
}
