import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  getAllBookmarks(userId: number) {
    return `This action returns all bookmark`;
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return `This action returns a #${userId} bookmark`;
  }

  createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    return 'This action adds a new bookmark';
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
