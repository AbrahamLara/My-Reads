import React, { Component } from 'react';
import './css/Book.css';

class Book extends Component {
    default_cover = 'https://books.google.com/books/content?id=NLK2AAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'

    render() {
        const { book, onMovedToNewShelf } = this.props;

        // Results in Search page that don't have a cover, shelf, or authors are given default values
        const cover = 'imageLinks' in book ? book.imageLinks.thumbnail : this.default_cover;
        const shelf = 'shelf' in book ? book.shelf : 'none';
        const authors = 'authors' in book ? book.authors.join(', ') : 'No authors to display';

        return (
            <div className='Book'>
                <div className='book-top'>
                    <img alt='Book Thumbnail' src={cover} />
                    <div className='myreads-bookshelf-book-dropdown'>
                        <select defaultValue={shelf} onChange={(e) => onMovedToNewShelf(book, e.target.value)}>
                            <option value='move' disabled>Move to...</option>
                            <option value='currentlyReading'>Currently Reading</option>
                            <option value='wantToRead'>Want To Read</option>
                            <option value='read'>Read</option>
                            <option value='none'>none</option>
                        </select>
                    </div>
                </div>
                <div className='book-title'>{book.title}</div>
                <div className='book-author'>{authors}</div>
            </div>
        );
    }
}

export default Book;