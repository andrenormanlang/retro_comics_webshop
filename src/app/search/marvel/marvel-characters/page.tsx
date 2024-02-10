"use client";

import { useEffect, Suspense, useState } from "react";
import {
	SimpleGrid,
	Box,
	Image,
	Text,
	Container,
	Center,
	Spinner,
	Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import type { NextPage } from "next";
import SearchBox from "@/components/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import ComicsPagination from "@/components/ComicsPagination";

import { MarvelCharacter } from "@/types/marvel/marvel-comic.type";
import MarvelPagination from "@/components/MarvelPagination";
import { useGetMarvelCharacters } from "@/hooks/marvel/useGetMarvelCharacters";

const MarvelCharacters: NextPage = () => {
	const pageSize = 15;
	const router = useRouter();
	const [searchParams, setSearchParams] = useSearchParams();

	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	const { searchTerm, setSearchTerm } = useSearchParameters(1, "");

	const { data, isLoading, isError, error } = useGetMarvelCharacters(
		searchTerm,
		currentPage,
		pageSize
	);

	const handleSearchTerm = useDebouncedCallback((value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to page 1 whenever the search term changes
		// No need for the `newOffset` variable here since we are not passing `newPage`
	}, 500);

	// ... useEffect for updating URL parameters
	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("page", currentPage.toString());
		if (searchTerm) {
			url.searchParams.set("query", searchTerm);
		} else {
			url.searchParams.delete("query");
		}
		// Convert URL object to a string
		const urlString = url.toString();
		router.push(urlString, undefined);
	}, [searchTerm, currentPage, router]);

	useEffect(() => {
		// Make sure searchParams is a URLSearchParams object
		const searchParams = new URLSearchParams(window.location.search);

		const page = parseInt(searchParams.get("page") || "1", 10);

		if (!isNaN(page) && page > 0) {
			setCurrentPage(page);
		} else {
			setCurrentPage(100);
		}
	}, []);
	const isSearchMode = data && data.results;

	useEffect(() => {
		if (data && data.data && data.data.total) {
			const pages = Math.ceil(data.data.total / pageSize);
			setTotalPages(pages);
			// If you're still on page 1 after search, you may want to call onPageChange(1) here to force a refetch
		}
	}, [data, pageSize]);

	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("page", currentPage.toString());
		if (searchTerm) {
			url.searchParams.set("query", searchTerm);
		} else {
			url.searchParams.delete("query");
		}
		const urlString = url.toString();
		router.push(urlString, undefined);
	}, [searchTerm, currentPage, router]);

	const onPageChange = (newPage: number) => {
		setCurrentPage(newPage);
		// const newOffset = (newPage - 1) * pageSize;
		// Now you need to refetch the data with the new offset.
		// This will depend on how your fetching logic is set up.
	};

	if (isLoading)
		return (
			<Center h="100vh">
				<Spinner size="xl" />
			</Center>
		);

	if (isError) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh", // Full viewport height
					fontFamily: '"Bangers", cursive', // Assuming "Bangers" font is loaded
					fontSize: "1.5rem", // Larger font size
					color: "red", // Red color for the error message
					textAlign: "center",
					padding: "20px",
					backgroundColor: "#f0f0f0", // Light background for visibility
					borderRadius: "10px",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // Optional shadow for better appearance
				}}
			>
				Error: {error.message}
			</div>
		);
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Container maxW="container.xl" centerContent p={4}>
				<SearchBox onSearch={(value) => handleSearchTerm(value)} />
				{data && data.data && (
					<Box>
						<Text fontSize="1.5em" mb={4} textAlign="center">
							{searchTerm
								? `You have ${
										data.data.total
								  } results for "${searchTerm}" in ${Math.ceil(
										data.data.total / pageSize
								  )} pages`
								: `You have a total of ${
										data.data.total
								  } Marvel characters in ${Math.ceil(
										data.data.total / pageSize
								  )} pages`}
						</Text>
					</Box>
				)}
				<SimpleGrid
					columns={{ base: 1, md: 3 }}
					spacing={30}
					width="100%"
				>
					{data.data &&
						Array.isArray(data.data.results) &&
						data.data.results.map(
							(marvelCharacter: MarvelCharacter) => (
								<NextLink
									href={`/search/marvel/marvel-characters/${marvelCharacter.id}?page=${currentPage}&query=${searchTerm}`}
									passHref
									key={marvelCharacter.id}
								>
									<motion.div whileHover={{ scale: 1.05 }}>
										<Box
											boxShadow="0 4px 8px rgba(0,0,0,0.1)"
											rounded="sm"
											overflow="hidden"
											p={4}
											display="flex"
											flexDirection="column"
											alignItems="center"
											justifyContent="space-between"
											minH="300px"
											minW="300px"
										>
											<Image
												src={`${marvelCharacter.thumbnail.path}/portrait_uncanny.${marvelCharacter.thumbnail.extension}`}
												alt={marvelCharacter.name}
												maxW="300px"
												maxH="300px"
												objectFit="contain"
											/>
											<Text
											mt={4}
											fontWeight="bold"
											fontSize="1rem"
											textAlign="center"
										>
												{marvelCharacter.name}
											</Text>
										</Box>
									</motion.div>
								</NextLink>
							)
						)}
				</SimpleGrid>

				<MarvelPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				/>
			</Container>
		</Suspense>
	);
};

export default MarvelCharacters;
