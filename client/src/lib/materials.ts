import * as THREE from 'three'

export const silverMaterial = new THREE.MeshPhysicalMaterial({
    color: '#C0C0C0', // Cor base da prata (um cinza claro)
    metalness: 0.7, // Alta metalicidade para simular um metal
    roughness: 0.1, // Baixa rugosidade para um acabamento brilhante
    clearcoat: 1, // Adiciona um revestimento claro para reflexões mais nítidas
    clearcoatRoughness: 0.1, // Suaviza o revestimento
    reflectivity: 0.9, // Alta refletividade
    envMapIntensity: 1, // Intensidade do mapa de ambiente (reflexões)
})

export const grayPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#333333', // Cinza escuro
    metalness: 0, // Não metálico
    roughness: 0.5, // Rugosidade moderada
    clearcoat: 0.3, // Adiciona um leve revestimento brilhante para simular o polimento do ABS
    clearcoatRoughness: 0.2, // Suaviza o revestimento
    envMapIntensity: 0.3, // Intensidade de reflexões baixa
    side: THREE.DoubleSide, // Para garantir que a cor apareça em ambos os lados
});

export const redPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#C8102E', // Um vermelho vibrante, mas realista
    metalness: 0, // Não metálico
    roughness: 0.4, // Rugosidade moderada para um acabamento semibrilhante
    clearcoat: 0.5, // Adiciona um revestimento brilhante para simular o polimento do plástico
    clearcoatRoughness: 0.1, // Suaviza o revestimento para reflexões nítidas
    envMapIntensity: 0.5, // Intensidade moderada de reflexões
    side: THREE.DoubleSide, // Para garantir que a cor apareça em ambos os lados
});

export const darkPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1C2526', // Preto acinzentado, típico de plásticos escuros
    metalness: 0, // Não metálico
    roughness: 0.6, // Rugosidade moderada para um acabamento levemente fosco
    clearcoat: 0.3, // Adiciona um leve revestimento brilhante para simular o polimento
    clearcoatRoughness: 0.2, // Suaviza o revestimento para reflexões sutis
    envMapIntensity: 0.4, // Intensidade moderada de reflexões
});

export const screenMaterial = new THREE.MeshPhysicalMaterial({
    // Cor base preta com leve tonalidade azulada (típico de monitores LCD/LED)
    color: new THREE.Color(0x0a0a0e),

    // Propriedades físicas
    metalness: 0.2,            // Leve qualidade metálica
    roughness: 0.2,            // Baixa rugosidade para alta reflexão
    reflectivity: 0.8,         // Alta reflexividade

    // Propriedades de vidro
    clearcoat: 1.0,            // Camada de revestimento máxima
    clearcoatRoughness: 0.1,   // Revestimento com pouca rugosidade

    // Transparência sutil
    transmission: 0.05,        // Transmissão mínima 
    opacity: 0.98,

    // Ativar efeitos de ambiente
    envMapIntensity: 0.7       // Intensidade do mapa de ambiente (se usado)
});

export const neonOffMaterial = new THREE.MeshStandardMaterial({
    color: '#1A1A1A', // Cinza escuro para simular o tubo de neon apagado
    emissiveIntensity: 4, // Intensidade de emissão
    metalness: 0, // Não metálico
    roughness: 0.5, // Acabamento semibrilhante
});