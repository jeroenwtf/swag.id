import {
    Email,
    Container,
    Row,
    Typography,
} from "@brail/react";

export default function Layout({ children }:any) {
  return (
    <Email>
      <Container>
        <Row p={16}>
          <Typography as="h1" fontSize={12} mb={24}>SWAG<span style={{ color: '#888888' }}>.id</span></Typography>

          {children}

          <Typography fontSize={12} mt={48} color="#888888">
            SWAG.id &copy; 2023 &mdash; Your presence on the interwebs, just cooler.<br />
            All the legal yadda yadda.
          </Typography>
        </Row>
      </Container>
    </Email>
 
  )
}
