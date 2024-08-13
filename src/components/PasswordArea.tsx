import { useState } from "react"
import { IconButton, TextField, TextFieldProps } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

export default function PasswordField({
  value,
  onChange,
  ...props
}: TextFieldProps) {
  const [visiblePassword, setVisiblePassword] = useState(false)
  return (
    <TextField
      label="Password"
      type={visiblePassword ? "text" : "password"}
      value={value}
      autoComplete="off"
      onChange={onChange}
      required
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => setVisiblePassword(!visiblePassword)}>
            {visiblePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        ),
      }}
      {...props}
    />
  )
}
