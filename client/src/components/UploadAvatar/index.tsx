import * as React from "react";
import { useDropzone } from "react-dropzone";
import { User } from "../../generated/graphql";
import { AvatarContainer, StyledAvatar } from "../../styles";
import { ReactComponent as UploadIcon } from "../svgs/UploadIcon.svg";

interface Props {
  user: User;
  saving: boolean;
  upload: any;
}

export const UploadAvatar: React.FC<Props> = ({ user, saving, upload }) => {
  const [image, setImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string>();

  const onDrop = React.useCallback((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    setImage(file![0]);
    reader.readAsDataURL(file![0]);
  }, []);

  async function uploadavatar() {
    await upload({
      variables: { file: image!, userId: user!.id },
    });
  }

  React.useEffect(() => {
    if (saving && image!) {
      uploadavatar();
    }
    // eslint-disable-next-line
  }, [image, saving]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  return (
    <div
      {...getRootProps()}
      style={{
        borderRadius: "9999px",
        border: "3px solid rgb(21, 32, 43)",
        borderStyle: isDragActive ? "dashed" : "solid",
        width: "100px",
        height: "100px",
        marginTop: "-40px",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />

      <AvatarContainer
        style={{ position: "absolute", top: 0, left: 0 }}
        width={100}
        noRightMargin
        height="100px"
      >
        {preview ? (
          <StyledAvatar url={preview} />
        ) : (
          <StyledAvatar url={user!.avatar!} />
        )}

        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
            borderRadius: "9999px",
          }}
        ></div>
        <div
          style={{ position: "absolute", top: "40%", left: "40%", zIndex: 2 }}
        >
          <UploadIcon />
        </div>
      </AvatarContainer>
    </div>
  );
};
