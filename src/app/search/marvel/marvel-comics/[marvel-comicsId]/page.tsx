"use client";

import React, { Suspense, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	Box,
	Image,
	Text,
	VStack,
	Tag,
	Flex,
	Container,
	useColorModeValue,
	Heading,
	Button,
	Center,
	Spinner,
	SimpleGrid,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useGetMarvelComic } from "@/hooks/marvel/useGetMarvelComics";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { CharacterItem, ComicItem, CreatorItem, EventItem, SeriesItem, StoryItems } from "@/types/marvel/marvel-comic.type";
import { extractIdFromURI } from "@/helpers/Marvel/extractIdFromURI";
import FlexContainer from "@/helpers/Marvel/FlexContainer";

const MarvelComic: NextPage = () => {
	// const [comic, setComic] = useState<ComicVineIssue | null>(null);
	const router = useRouter();
	const [setIsLoading] = useState(false);
	const { searchTerm, currentPage } = useSearchParameters();
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const hoverBgColor = useColorModeValue('red.100', 'red.700');
	const textColor = useColorModeValue('black', 'white');
	const boxHoverShadow = '0 0 10px 0 rgba(0,0,0,0.5)';
	const pathname = usePathname();
	const comicId = pathname.split("/").pop() || "";
	const searchParams = useSearchParams();

	const { data, isLoading, isError, error } = useGetMarvelComic(comicId);

	const handleBack = () => {
		// Read the page number and search term from the search parameters

		// Navigate back to the issues page with both the page number and search term
		router.push(
			`/search/marvel/marvel-comics?page=${currentPage}&query=${encodeURIComponent(
				searchTerm
			)}`
		);
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			day: "numeric",
			month: "short",
			year: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const linkHoverStyle = {
		textDecoration: 'none',
		backgroundColor: useColorModeValue('red.100', 'red.700'), // change color based on color mode
		transform: 'translateY(-2px)', // subtle lift effect
		boxShadow: 'lg', // larger shadow for lifted effect
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

	const result = data?.data?.results?.[0];

	const solicitationText =
		result?.textObjects?.[0]?.text || "No description available.";

	return (
		<Suspense
			fallback={
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
					Loading...
				</div>
			}
		>
			<Container maxW="1100px" p={4}>
				<Box mb={4}>
					<Button
						leftIcon={<ArrowBackIcon />}
						colorScheme="teal"
						variant="outline"
						onClick={handleBack}
					>
						Back to Grid
					</Button>
				</Box>

				<VStack spacing={2}>
					{/* Content Box */}
					<Flex
						bg={bgColor}
						p={4}
						borderRadius="md"
						borderWidth="1px"
						borderColor={borderColor}
						direction={{ base: "column", md: "row" }}
						align="" // Center align items for better responsiveness
						justify=""
						width={{ base: "100%", md: "90%", lg: "1100px" }} // Responsive width
					>
						{/* Image */}
						<Image
							src={`${result?.thumbnail.path}/portrait_uncanny.jpg`}
							alt={data?.data?.results?.[0]?.title || "No Title"}
							maxW="300px"
							maxH="450px"
							objectFit="cover"
							mb={{ base: 4, md: 0 }}
							alignSelf={{ base: "center", md: "auto" }} // Center on mobile, default alignment on larger screens
							justifySelf={{ base: "center", md: "auto" }} // Center on mobile, default alignment on larger screens
							mx={{ base: "auto", md: 0 }} // Horizontal margin auto for mobile to center the image
						/>

						<VStack
							spacing={4}
							align="start"
							maxW="1000px"
							marginLeft={4}
						>
							<Tag
								size="lg"
								colorScheme="blue"
							>{`Issue #${result?.issueNumber}`}</Tag>
							<Tag size="lg" colorScheme="green">
								{formatDate(
									result?.dates?.find(
										(date: { type: string }) =>
											date.type === "onsaleDate"
									)?.date || new Date()
								)}
							</Tag>
							<Heading
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="tomato"
								size="lg"
							>
								{result?.series?.name || "Unknown Series"}
							</Heading>
							<Text
								p={4}
								bg={bgColor}
								borderRadius="md"
								// borderWidth="1px"
								borderColor={borderColor}
							>
								{solicitationText}
							</Text>
						</VStack>
					</Flex>
					<Flex
					bg={bgColor}
					p={4}
					borderRadius="md"
					borderWidth="1px"
					borderColor={borderColor}
					direction={{ base: "column", md: "row" }}
					align="flex-start"
					justify="space-between"
					width={{ base: "100%", md: "90%", lg: "1100px" }}
				>
					<VStack spacing={4} align="stretch">
						<Box>
							<Heading
								size="md"
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="orange"
							>
								Creators:
							</Heading>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={1}
							>
								{result?.creators?.items?.map(
									(creator: CreatorItem) => {
										const comicId = extractIdFromURI(
											creator.resourceURI
										);

										// Wrap with NextLink for navigation
										return (
											<NextLink
												href={`/search/marvel/marvel-creators/${comicId}`}
												passHref
												key={creator.name}
											>
												 <FlexContainer as="a" p={2} boxShadow="md" borderRadius="md" _hover={linkHoverStyle}>
													<Text textAlign="start">{`${creator.name} - ${creator.role}`}</Text>
												</FlexContainer>
											</NextLink>
										);
									}
								)}
							</SimpleGrid>
						</Box>
						<Box>
							<Heading
								size="md"
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="orange"
							>
								Characters:
							</Heading>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={4}
							>	{result?.characters?.items?.map(
								(charactersItem: CharacterItem) => {
									// Extract the ID inside the map callback function
									const comicId = extractIdFromURI(
										charactersItem.resourceURI
									);

									return (
										// Assuming you have a route set up for comic details
										<NextLink
											href={`/search/marvel/marvel-characters/${comicId}`}
											passHref
											key={charactersItem.name}
										>
											<FlexContainer as="a" p={2} boxShadow="md" borderRadius="md" _hover={linkHoverStyle}>
												<Text textAlign="start">
													{charactersItem.name}
												</Text>
											</FlexContainer>
										</NextLink>
									);
								}
							)}
							</SimpleGrid>
						</Box>

						<Box>
							<Heading
								size="md"
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="orange"
							>
								Series:
							</Heading>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={1}

							>
								{result?.comics?.items?.map(
									(seriesItem: SeriesItem) => {
										// Extract the ID inside the map callback function
										const comicId = extractIdFromURI(
											seriesItem.resourceURI
										);

										return (
											// Assuming you have a route set up for comic details
											<NextLink
												href={`/search/marvel/marvel-series/${comicId}`}
												passHref
												key={seriesItem.name}
											>
												<FlexContainer as="a" p={2} boxShadow="md" borderRadius="md" _hover={linkHoverStyle}>
													<Text textAlign="start">
														{seriesItem.name}
													</Text>
												</FlexContainer>
											</NextLink>
										);
									}
								)}
							</SimpleGrid>
						</Box>
						<Box>
							<Heading
								size="md"
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="orange"
							>
								Events:
							</Heading>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={1}
							>
								{result?.events?.items?.map(
									(eventItem: EventItem) => {
										// Extract the ID inside the map callback function
										const comicId = extractIdFromURI(
											eventItem.resourceURI
										);

										return (
											// Assuming you have a route set up for comic details
											<NextLink
												href={`/search/marvel/marvel-events/${comicId}`}
												passHref
												key={eventItem.name}
											>
												<FlexContainer as="a" p={2} boxShadow="md" borderRadius="md" _hover={linkHoverStyle}>
													<Text textAlign="start">
														{eventItem.name}
													</Text>
												</FlexContainer>
											</NextLink>
										);
									}
								)}
							</SimpleGrid>
						</Box>
						<Box>
							<Heading
								size="md"
								fontFamily="Bangers"
								letterSpacing="0.05em"
								color="orange"
							>
								Stories:
							</Heading>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={1}
							>
								{result?.stories?.items?.map(
									(storyItem: StoryItems) => {
										// Extract the ID inside the map callback function
										const comicId = extractIdFromURI(
											storyItem.resourceURI
										);

										return (
											// Assuming you have a route set up for comic details
											<NextLink
												href={`/search/marvel/marvel-stories/${comicId}`}
												passHref
												key={storyItem.name}
											>
												<FlexContainer as="a" p={2} boxShadow="md" borderRadius="md" _hover={linkHoverStyle}>
													<Text textAlign="start">
														{storyItem.name}
													</Text>
												</FlexContainer>
											</NextLink>
										);
									}
								)}
							</SimpleGrid>
						</Box>
					</VStack>
				</Flex>
				</VStack>
			</Container>
		</Suspense>
	);
};

export default MarvelComic;
