import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Posts 1" },
  { id: 2, title: "Posts 2" },
];

/*
  /posts -> ["posts"]
  /posts/1 -> ["posts", post.id]
  /posts?authorId=1 -> ["posts", {authorId: 1}]
  /posts/2/comments -> ["posts", post.id, "comments"]
*/

const App = () => {
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // queryFn: () => Promise.reject("Error Message!")
  });

  const newPostMutation = useMutation({
    mutationFn: async (title) => {
      await wait(1000);
      return POSTS.push({ id: crypto.randomUUID(), title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    }
  });

  if (postQuery.isLoading) {
    return <h1>Loading....</h1>;
  }

  if (postQuery.isError) {
    return <pre>{JSON.stringify(postQuery.error)}</pre>;
  }

  // console.log(POSTS);

  return (
    <div>
      <h1>Tanstack Query</h1>
      <div>
        {postQuery.data.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
        <button
          disabled={newPostMutation.isPending}
          onClick={() => newPostMutation.mutate("New Post")}
        >
          Add New
        </button>
      </div>
    </div>
  );
};

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
