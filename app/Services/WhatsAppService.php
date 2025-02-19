<?php

namespace App\Services;

use GuzzleHttp\Client;

class WhatsAppService
{
    protected $client;
    protected $token;
    protected $phoneId;

    public function __construct()
    {
        $this->client = new Client();
        $this->token = "EAAQCuVdk670BO17IMqVb90ldvabICWwIobpzTTPwAkquEsA0hADr1HgcBV7IPHB9ZAw7KWLkbeC7r4a7XuzA3uQkyvKrCWx1AXJCy4A02airzs7mjdHqVAQyqkqtpg8rGrJ7ffnn8Rw3lSFjNV1p6WCcPyy9aLwVU3sZAbdzyZB5tHjOiZA3xZBcvpdt0rhr0tmbCslQs1smjPw1YkRekIssTZB1KmvpIYndsDyhVuDwZDZD";
        $this->phoneId = "590915364099734";
    }

    public function enviarMensaje($numero, $mensaje)
    {
        try {
            $url = "https://graph.facebook.com/v18.0/{$this->phoneId}/messages";
            
            $response = $this->client->post($url, [
                'headers' => [
                    'Authorization' => "Bearer {$this->token}",
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to' => "+57{$numero}",
                    'type' => 'text',
                    'text' => ['body' => $mensaje],
                ],
            ]);
    
            return json_decode($response->getBody(), true);
    
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ];
        }
    }
    
}
