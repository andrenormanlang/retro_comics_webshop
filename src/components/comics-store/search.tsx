import { Input, InputGroup, InputLeftElement, Icon, Box, Text, useColorModeValue, Center } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchBarProps {
	onSearch: (query: string) => void;
	searchQuery: string;
	totalResults: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchQuery, totalResults }) => {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value);
	};

	const bgColor = useColorModeValue("white", "gray.700");
	const borderColor = useColorModeValue("gray.300", "gray.600");
	const textColor = useColorModeValue("black", "white");

	return (
		<Center mb={4} width="100%">
			<Box width={{ base: "100%", md: "50%" }}>
				<InputGroup>
					<InputLeftElement pointerEvents="none">
						<Icon as={SearchIcon} color={borderColor} />
					</InputLeftElement>
					<Input
						type="text"
						placeholder="Search for comics..."
						onChange={handleSearchChange}
						value={searchQuery}
						bg={bgColor}
						borderColor={borderColor}
						color={textColor}
						_hover={{ borderColor: "gray.500" }}
					/>
				</InputGroup>
				{searchQuery && (
					<Box mt={2} textAlign="center">
						<Text color={textColor}>
							Found {totalResults} results for &quot;{searchQuery}&quot;
						</Text>
					</Box>
				)}
			</Box>
		</Center>
	);
};

export default SearchBar;
