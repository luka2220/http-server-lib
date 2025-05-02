package httpserver

import (
	"log"
	"net"
	"strings"
)

type Server struct {
	Addr string
}

func (s *Server) ListenAndServe() error {
	listener, err := net.Listen("tcp", s.Addr)
	if err != nil {
		return err
	}

	defer listener.Close()

	// Handle connections
	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Print(err)
		}

		go handleConnection(conn)
	}
}

func handleConnection(c net.Conn) {
	defer c.Close()

	data := make([]byte, 1024)
	if _, err := c.Read(data); err != nil {
		log.Print(err)
		return
	}

	if err := parseHttpRequest(data); err != nil {
		log.Print(err)
		return
	}
}

// NOTE: An example HTTP/0.9 request is as follows -> GET index.html
func parseHttpRequest(d []byte) error {
	request := string(d)
	resource := strings.Split(request, " ")
	log.Println("Resource: ", resource)
	return nil
}
