import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import "./style.css";

type EditModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editDraft: any;
    setEditDraft: (draft: any) => void;
};

const EditModal = ({ open, onClose, onSave, editDraft, setEditDraft }: EditModalProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);

    if (!open || !editDraft) return null;

    /* helpers */
    const getLoc = (lang: "ka" | "en") =>
        editDraft?.localizations?.[lang] ?? null;

    return (
        <div className="edit-overlay" onClick={onClose}>
            <div
                className="edit-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <Typography variant="h6" className="modal-title">პოსტის რედაქტირება</Typography>
                <Button className="close-btn" onClick={onClose}>
                    <CloseIcon />
                </Button>

                <Box className="modal-content">
                    {(imageFile || editDraft.imagePath) && (
                        <img
                            src={"http://localhost:5000" + (imageFile ? URL.createObjectURL(imageFile) : editDraft.imagePath)}
                            alt="preview"
                            style={{ maxWidth: 300, borderRadius: 8 }}
                        />
                    )}

                    <Button component="label" variant="outlined">
                        სურათის შეცვლა
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const file = e.target.files[0];
                                    setImageFile(file);
                                    // Update the editDraft with the image file
                                    setEditDraft({
                                        ...editDraft,
                                        imageFile: file
                                    });
                                }
                            }}
                        />
                    </Button>

                    <Divider />

                    <TextField
                        label="სათაური (KA)"
                        value={getLoc("ka")?.title || ""}
                        onChange={(e) => {
                            editDraft.localizations.ka.title = e.target.value;
                            setEditDraft({ ...editDraft });
                        }}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="აღწერა (KA)"
                        value={getLoc("ka")?.description || ""}
                        onChange={(e) => {
                            editDraft.localizations.ka.description = e.target.value;
                            setEditDraft({ ...editDraft });
                        }}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <Divider />

                    <TextField
                        label="Title (EN)"
                        value={getLoc("en")?.title || ""}
                        onChange={(e) => {
                            editDraft.localizations.en.title = e.target.value;
                            setEditDraft({ ...editDraft });
                        }}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Description (EN)"
                        value={getLoc("en")?.description || ""}
                        onChange={(e) => {
                            editDraft.localizations.en.description = e.target.value;
                            setEditDraft({ ...editDraft });
                        }}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <Box display="flex" gap={2} className="modal-actions">
                        <Button startIcon={<SaveIcon />} variant="contained" onClick={() => {
                            onSave();
                            setImageFile(null);
                        }}>
                            შენახვა
                        </Button>
                        <Button
                            startIcon={<CloseIcon />}
                            variant="outlined"
                            onClick={() => {
                                onClose();
                                setImageFile(null);
                            }}
                        >
                            გაუქმება
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default EditModal;
