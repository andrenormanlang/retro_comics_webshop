"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	Box,
	Image,
	Text,
	VStack,
	HStack,
	Tag,
	Flex,
	Badge,
	Container,
	useColorModeValue,
	Heading,
	Button,
	Center,
	Spinner,
	SimpleGrid,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { useGetComicVineCharacter } from "@/hooks/comic-vine/useGetComicVineCharacters";
import { parse } from "node-html-parser";
import Parser from "html-react-parser";
import ComicVineCharacterDescription from "@/helpers/ComicVineIssues/ComicVineCharacterDescription";

const ComicVineCharacter: NextPage = () => {
	// const [comic, setComic] = useState<ComicVineIssue | null>(null);
	const router = useRouter();
	const { searchTerm, currentPage } = useSearchParameters();
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const pathname = usePathname();
	const issueId = pathname.split("/").pop() || "";
	const searchParams = useSearchParams();

	const { data: comic, isLoading, isError, error } = useGetComicVineCharacter(searchTerm, currentPage, issueId);

	const renderContentWithImages = (htmlContent: string) => {
		const root = parse(htmlContent);
		const figures = root.querySelectorAll("figure");

		figures.forEach((figure) => {
			const imgElement = figure.querySelector("img");
			if (imgElement) {
				const src = imgElement.getAttribute("src");
				// Replace with Chakra UI Image component
				imgElement.replaceWith(`<Image src="${src}" maxW="100%" height="auto" />`);
			}
		});

		return root.toString();
	};

	const transform = (node: any) => {
		// If it's an image node
		if (node.type === "tag" && node.name === "img") {
			return (
				<Image
					src={node.attribs["data-src"] || node.attribs.src} // Ensure you get the correct source attribute
					alt={node.attribs.alt}
					maxW="100%"
					height="auto"
					// Add any other props you need here
				/>
			);
		}
	};

	const contentContainerStyle = {
		bg: useColorModeValue("white", "gray.800"),
		borderRadius: "md",
		borderWidth: "1px",
		borderColor: useColorModeValue("gray.200", "gray.700"),
		my: 4, // Margin for y-axis (top and bottom)
		overflow: "hidden", // In case of overflow, you can adjust this
		maxWidth: { base: "90vw", sm: "400px", md: "700px", lg: "900px", xl: "1200px" },
		// You could also use percentage values for maxWidth, for example, base: "100%", sm: "90%", etc.
		width: "100%", // Ensure the width is always 100% of the parent container
		px: { base: 1.5, sm: 4, md: 6 }, // Responsive padding on the x-axis (left and right)
		py: { base: 2, sm: 4 }, // Responsive padding on the y-axis (top and bottom)
	};
	const handleBack = () => {
		// Navigate back to the issues page with both the page number and search term
		router.push(`/search/comic-vine/characters?page=${currentPage}&query=${encodeURIComponent(searchTerm)}`);
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
					height: "100vh",
					fontFamily: '"Bangers", cursive',
					fontSize: "1.5rem",
					color: "red",
					textAlign: "center",
					padding: "20px",
					backgroundColor: "#f0f0f0",
					borderRadius: "10px",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
				}}
			>
				Error: {error.message}
			</div>
		);
	}

	const imageUrl = comic.results?.image?.original_url || "defaultImageUrl";
	
	const htmlContent = comic.results?.description || "No description available.";

	const aliasesArray = comic.results?.aliases ? comic.results.aliases.split(/\r\n|\n/) : [];

	return (
		<Suspense
			fallback={
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
						fontFamily: '"Bangers", cursive',
						fontSize: "1.5rem",
						color: "red",
						textAlign: "center",
						padding: "20px",
						backgroundColor: "#f0f0f0",
						borderRadius: "10px",
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
					}}
				>
					Loading...
				</div>
			}
		>
			<Container maxW="1150px" p={4}>
				<Box mb={4}>
					<Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline" onClick={handleBack}>
						Back to Grid
					</Button>
				</Box>
				<VStack spacing={2}>
					{/* Content Box */}
					<Flex
						bg={bgColor}
						p={2}
						borderRadius="md"
						borderWidth="1px"
						borderColor={borderColor}
						direction={{ base: "column", md: "row" }}
						align=""
						justify=""
						// maxWidth: { base: "90vw", sm: "500px", md: "800px", lg: "1000px", xl: "1300px" },
						width={{ base: "90vw", sm: "400px", md: "700px", lg: "900px", xl: "1200px" }}
					>
						<VStack spacing={4} align="">
							{/* Image */}
							<Box
								bg={bgColor}
								p={4}
								borderRadius="md"
								shadow="md"
								color="red.500"
								// borderWidth="1px"
								borderColor={borderColor}
								maxWidth=""
							>
								<Image
									borderRadius="md"
									boxSize={{ base: "100%", md: "600px" }}
									objectFit="contain"
									p={2}
									src={imageUrl}
									alt={`Cover of ${comic.name}`}
									mb={{ base: 2, md: 0 }}
									mx={{ base: "auto", md: 0 }}
								/>
							</Box>

							<Box
								bg={bgColor}
								p={4}
								borderRadius="md"
								shadow="md"
								color="red.500"
								// borderWidth="1px"
								borderColor={borderColor}
								maxWidth=""
							>
								<Text
									fontWeight="bold"
									fontSize={{ base: "1rem", md: "lg" }}
									textAlign="initial"
									mt={4}
								>
									REAL NAME: {comic.results.real_name}
								</Text>
								<Text
									fontWeight="bold"
									color="green"
									fontSize={{ base: "1rem", md: "lg" }}
									textAlign="initial"
									mt={4}
								>
									BIRTH: {comic.results.birth}
								</Text>
								<Text
									fontWeight="bold"
									color="red.200"
									fontSize={{ base: "1rem" }}
									textAlign="initial"
									mt={4}
								>
									PUBLISHER: {comic.publisher ? comic.publisher.name : "Unknown Publisher"}
								</Text>
							</Box>

							<Box
								bg={bgColor}
								p={4}
								borderRadius="md"
								shadow="md"
								borderColor={borderColor}
								maxWidth="full"
								overflowX="auto"
								className="alias-container"
							>
								<Text fontWeight="bold" fontSize={{ base: "1rem", md: "lg" }} mb={2}>
									Aliases:
								</Text>
								<HStack spacing={2} wrap="wrap">
									{aliasesArray.map((alias: string, index: React.Key | null | undefined) => (
										<Tag
											key={index}
											borderRadius="full"
											variant="solid"
											colorScheme="teal"
											fontWeight={600}
											fontSize={{ base: "1rem", md: "md" }}
											px={3}
											py={2}
											m={1}
											_hover={{ transform: "scale(1.05)", cursor: "pointer" }}
										>
											{alias}
										</Tag>
									))}
								</HStack>
							</Box>
							<Box
								bg={bgColor}
								p={4}
								borderRadius="md"
								shadow="md"
								fontSize={{ base: "0.9rem", md: "md" }}
								borderColor={borderColor}
								maxWidth=""
							>
								{comic.results.deck}
							</Box>
						</VStack>
					</Flex>
				</VStack>
			</Container>
			<Container {...contentContainerStyle}>
				<Accordion allowToggle>
					<AccordionItem>
						<h2>
							<AccordionButton>
								<Box as="span" color="red" flex="1" textAlign="left">
									<Text fontWeight="bold" fontSize={{ base: "1rem", md: "lg" }} mb={2}>
										FULL DESCRIPTION:
									</Text>
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							<ComicVineCharacterDescription content={htmlContent} />
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Container>
		</Suspense>
	);
};

export default ComicVineCharacter;
