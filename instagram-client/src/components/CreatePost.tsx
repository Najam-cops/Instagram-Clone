import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../services/apiServices";

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 3) {
      alert("You can only upload up to 3 images");
      return;
    }

    setSelectedFiles(files);

    // Create URL previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      // Clean up old preview URLs
      prev.forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiService.createPost(description, selectedFiles);
      setDescription("");
      setSelectedFiles([]);
      setPreviews((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      onPostCreated();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  return (
    <Card className="max-w-[470px] mb-6 mx-auto border border-gray-200 rounded-lg shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            multiline
            rows={3}
            placeholder="Write a caption..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <Box className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />

            {previews.length === 0 ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                startIcon={<AddPhotoAlternateIcon />}
                className="h-32"
              >
                Add Photos (Max 3)
              </Button>
            ) : (
              <Box className="grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <Box key={preview} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <IconButton
                      size="small"
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70"
                      onClick={() => removeImage(index)}
                    >
                      <CloseIcon className="text-white text-sm" />
                    </IconButton>
                  </Box>
                ))}
                {previews.length < 3 && (
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square"
                  >
                    <AddPhotoAlternateIcon />
                  </Button>
                )}
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting || selectedFiles.length === 0}
          >
            {isSubmitting ? "Posting..." : "Share Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
