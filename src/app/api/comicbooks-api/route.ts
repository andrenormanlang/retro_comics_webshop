// pages/api/comics/index.js
import { NextRequest, NextResponse } from 'next/server';
const comicsApi = require('comicbooks-api');

export async function GET(request: NextRequest) {
	// Correctly parse URL parameters
	const urlParams = new URL(request.url).searchParams;
	const searchTerm = urlParams.get('query'); // Search term may or may not be present
	const page = parseInt(urlParams.get('page') || '1', 10); // Correct radix parameter

	try {
	  let comics;

	  // Determine action based on the presence of a search term
	  if (searchTerm) {
		// Search for comics using the provided term
		comics = await comicsApi.getComicsThroughSearch(searchTerm, page);
	  } else {
		// Fetch the latest comics if no search term is provided
		comics = await comicsApi.getLatestComics(page);
	  }

	  // Return comics data as JSON
	  return new NextResponse(JSON.stringify(comics), {
		status: 200,
		headers: {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Origin': '*', // Consider specifying domains or removing if not needed
		},
	  });
	} catch (error) {
	  // Handle any errors that occur during the fetch
	  console.error('Failed to fetch comics:', error);
	  return new NextResponse(JSON.stringify({ error: 'Failed to fetch comics' }), {
		status: 500,
		headers: {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Origin': '*', // Consider specifying domains or removing if not needed
		},
	  });
	}
  }