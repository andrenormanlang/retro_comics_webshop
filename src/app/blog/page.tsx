'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Flex,
  Image,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { BlogPost } from '@/types/blog/blog.type';

const BlogPostList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
    checkAdminStatus();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) {
      setPosts(data as BlogPost[]);
    } else {
      toast({
        title: 'Error',
        description: error?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
      } else if (data && data.is_admin) {
        setIsAdmin(true);
      }
    }
  };

  const deletePost = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Only admin users can delete blog posts.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchPosts();
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Flex justifyContent="space-between" mb={4}>
        <Heading>Blog</Heading>
        {isAdmin && <Button onClick={() => router.push('/blog/create')}>New Post</Button>}
      </Flex>
      <VStack spacing={4} align="stretch">
        {posts.map((post) => (
          <Box
            key={post.id}
            p={4}
            shadow="md"
            borderWidth="1px"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s', cursor: 'pointer' }}
            onClick={() => router.push(`/blog/${post.id}`)}
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                boxSize={{ base: '100%', md: '150px' }}
                objectFit="cover"
                mb={{ base: 4, md: 0 }}
                mr={{ md: 4 }}
              />
            )}
            <Box flex="1" textAlign={{ base: 'left', md: 'left' }}>
              <Heading fontSize={'1.5rem'} fontFamily="Bangers, sans-serif" fontWeight="normal">
                {post.title}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}
              </Text>
              <Box noOfLines={3} dangerouslySetInnerHTML={{ __html: post.content }} />
              <Flex mt={4} justifyContent={{ base: 'center', md: 'flex-start' }}>
                {isAdmin && (
                  <>
                    <Button onClick={(e) => { e.stopPropagation(); router.push(`/blog/edit/${post.id}`); }}>Edit</Button>
                    <Button onClick={(e) => { e.stopPropagation(); deletePost(post.id); }} colorScheme="red" ml={2}>Delete</Button>
                  </>
                )}
              </Flex>
            </Box>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default BlogPostList;