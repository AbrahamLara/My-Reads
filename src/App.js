import React, { Component } from 'react';
import './css/App.css';
import BookShelf from './BookShelf';
import SearchPage from './SearchPage';
import * as BooksAPI from './BooksAPI';
import { Link, Route } from 'react-router-dom';

class App extends Component {
	state = {
		currentlyReading: [],
		wantToRead: [],
		read: [],
	}

	componentDidMount() {
		BooksAPI.getAll().then((books) => {
			this.setState((currState) => ({
				currentlyReading: currState.currentlyReading.concat(books.filter((book) => book.shelf === 'currentlyReading')),
				wantToRead: currState.currentlyReading.concat(books.filter((book) => book.shelf === 'wantToRead')),
				read: currState.currentlyReading.concat(books.filter((book) => book.shelf === 'read')),
			}));
		});
	}

	moveBookToShelf = (book, shelf) => {
		BooksAPI.update(book, shelf).then((shelves) => {
			this.setState((currState) => {
				let newShelves = {
					currentlyReading: currState.currentlyReading.filter((book) => shelves.currentlyReading.includes(book.id)),
					wantToRead: currState.wantToRead.filter((book) => shelves.wantToRead.includes(book.id)),
					read: currState.read.filter((book) => shelves.read.includes(book.id)),
				}
				if (shelf !== 'none') {
					book.shelf = shelf;
					newShelves[shelf].push(book);
				}
				return newShelves;
			});
		});
	}

	render() {
		const { currentlyReading, wantToRead, read } = this.state;

		return (
			<div>				
				<Route exact path='/' render={() => (
					<div>
						<nav className='myreads-title'>MyReads</nav>
						<div className='bookshelves-container'>
							<BookShelf
								id='currentlyReading'
								books={currentlyReading}
								name='Currently Reading'
								onBookMoved={this.moveBookToShelf}
							/>
							<BookShelf
								id='wantToRead'
								books={wantToRead}
								name='Want To Read'
								onBookMoved={this.moveBookToShelf}
							/>
							<BookShelf
								id='read'
								books={read}
								name='Read'
								onBookMoved={this.moveBookToShelf}
							/>
						</div>
						<div className='myreads-button'>
							<Link to='/search'>
								<button>Search</button>
							</Link>
						</div>
					</div>
				)}/>

				<Route path='/search' render={() => {
					const bookShelves = [
						...currentlyReading.map((book) => ({id: book.id, shelf: book.shelf})),
						...wantToRead.map((book) => ({id: book.id, shelf: book.shelf})),
						...read.map((book) => ({id: book.id, shelf: book.shelf}))
					];
					const bookIDs = bookShelves.map((book) => book.id);

					return (<SearchPage bookShelves={bookShelves} bookIDs={bookIDs} onBookMoved={this.moveBookToShelf}/>)
				}}/>
			</div>
		);
	}
}

export default App;
