"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Spinner, Alert, AlertIcon, Center, useColorModeValue } from "@chakra-ui/react";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [is_admin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url, is_admin`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setIsAdmin(data.is_admin);
      }
    } catch (error) {
      setError("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    fullname,
    username,
    website,
    avatar_url,
  }: {
    fullname: string | null;
    username: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      setError("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Box
        p={8}
        maxWidth="400px"
        width="full"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="md"
        borderRadius="md"
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Account
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        {loading ? (
          <Spinner />
        ) : (
          <VStack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="text" value={user?.email} isDisabled />
            </FormControl>
            <Avatar
              uid={user?.id ?? null}
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ fullname, username, website, avatar_url: url });
              }}
            />
            <FormControl id="fullName">
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                value={fullname || ''}
                onChange={(e) => setFullname(e.target.value)}
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="website">
              <FormLabel>Website</FormLabel>
              <Input
                type="url"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </FormControl>
            <FormControl id="isAdmin">
              <FormLabel>Admin Status</FormLabel>
              <Input
                type="text"
                value={is_admin ? 'Admin' : 'User'}
                isDisabled
              />
            </FormControl>
            <Button
              colorScheme="teal"
              width="full"
              onClick={() => updateProfile({ fullname, username, website, avatar_url })}
              isDisabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>
            <form action="/auth/signout" method="post">
              <Button colorScheme="red" width="full" type="submit">
                Sign out
              </Button>
            </form>
          </VStack>
        )}
      </Box>
    </Center>
  );
}