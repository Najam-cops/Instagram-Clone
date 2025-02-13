import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../services/apiServices";

interface CreatePostProps {
  onPostCreated: () => void;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `${file.name}: Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size exceeds 1MB limit.`;
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 3) {
      alert("You can only upload up to 3 images");
      return;
    }

    const newErrors: string[] = [];
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      }
    });

    setErrors(newErrors);
    setSelectedFiles(validFiles);
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return validPreviews;
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
    <Card className="max-w-[670px] mb-6 mx-auto border border-[#DBDBDB] rounded-lg shadow-none bg-white">
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#DBDBDB",
                },
                "&:hover fieldset": {
                  borderColor: "#A8A8A8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0095F6",
                },
              },
            }}
          />

          <Box className="relative">
            <input
              type="file"
              accept={ALLOWED_FILE_TYPES.join(",")}
              multiple
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />

            {errors.length > 0 && (
              <Box className="mb-3">
                {errors.map((error, index) => (
                  <Typography key={index} color="error" variant="body2">
                    {error}
                  </Typography>
                ))}
              </Box>
            )}

            {previews.length === 0 ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                startIcon={<AddPhotoAlternateIcon />}
                className="h-32"
                sx={{
                  borderColor: "#DBDBDB",
                  color: "#0095F6",
                  "&:hover": {
                    borderColor: "#0095F6",
                    backgroundColor: "rgba(0, 149, 246, 0.1)",
                  },
                }}
              >
                Add Photos (Max 3, 5MB each)
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
            disabled={
              isSubmitting || selectedFiles.length === 0 || errors.length > 0
            }
            sx={{
              backgroundColor: "#0095F6",
              "&:hover": {
                backgroundColor: "#1877F2",
              },
              "&.Mui-disabled": {
                backgroundColor: "#B2DFFC",
              },
            }}
          >
            {isSubmitting ? "Posting..." : "Share Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
